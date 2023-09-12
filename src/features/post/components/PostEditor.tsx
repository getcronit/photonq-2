import { FC, useState } from 'react';
import { TPost } from '../types/post';
import {
  Stack,
  Box,
  useBreakpointValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import MdxEditor from '../../../shared/components/MdxEditor';
import ActionToolbar from '../../../shared/components/action-toolbar/ActionToolbar';
import TbBookDownload from '../../../shared/components/icons/tabler/TbBookDownload';
import TbBookUpload from '../../../shared/components/icons/tabler/TbBookUpload';
import TbDeviceFloppy from '../../../shared/components/icons/tabler/TbDeviceFloppy';
import { TActionToolbarItem } from '../../../shared/components/action-toolbar/types/actionToolbar';
import TbPhoto from '../../../shared/components/icons/tabler/TbPhoto';
import useScrollPosition from '../../../shared/hooks/use-scroll-position';
import { wait } from '../../../shared/utils/utils';
import Alert from '../../../shared/components/alert/Alert';

const alertText = {
  publish: {
    label: 'Publish',
    header: 'Publish this post?',
    body: 'Are you sure you want to publish this post? This post will be visible to everyone.',
    confirmationLabel: 'Publish'
  },
  unpublish: {
    label: 'Unpublish',
    header: 'Unpublish this post?',
    body: 'Are you sure you want to unpublish this post? This post will no longer be visible to everyone.',
    confirmationLabel: 'Unpublish'
  }
};

interface IPostEditorProps {
  post?: TPost;
}

const PostEditor: FC<IPostEditorProps> = ({ post }) => {
  const isPublic = post?.privacy === 'public';

  const visibilityAlertDisclosure = useDisclosure({
    onClose: () => console.log('closed')
  });

  const [alertContent, setAlertContent] = useState(
    isPublic ? alertText.publish : alertText.publish
  );
  const scrollPosition = useScrollPosition();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const customToast = useToast();
  const actionToolbarItems =
    useBreakpointValue<TActionToolbarItem[]>({
      base: [
        {
          icon: <TbPhoto fontSize="xl" />,
          onClick: () => console.log('Upload new image'),
          tooltip: 'Upload new image',
          ariaLabel: 'Upload new image'
        }
      ],
      md: []
    }) ?? [];

  const publishPost = async () => {
    //TODO: Connect to Jaen
    //!Bug: This toast get's called exponentially (hello, memory leak)
    customToast({
      title: alertContent.header,
      description: alertContent.body,
      status: 'success'
    });
    setAlertContent(alertText.unpublish);
    return;
  };

  const unpublishPost = async () => {
    //TODO: Connect to Jaen
    await wait(1000); // Simulate publishing
    visibilityAlertDisclosure.onClose();
    setAlertContent(alertText.publish);
    // setPost({ ...post, createdAt: undefined }); //TODO: Remove after connecting to Jaen
    return;
  };

  const togglePostVisibility = () => {
    if (isPublic) unpublishPost();
    else publishPost();
  };

  const setPostPreviewImage = (src: File) => {
    // setPost({
    //   ...post,
    //   avatarUrl: URL.createObjectURL(src)
    // });
  };

  return (
    <>
      <Stack direction="row" position="relative" flex={1} overflow="hidden">
        <Box w="full">
          <MdxEditor hideHeadingHash />
          <ActionToolbar
            active={isMobile || scrollPosition > 90}
            actions={[
              ...actionToolbarItems,
              {
                icon: <TbDeviceFloppy />,
                ariaLabel: 'Save this post',
                tooltip: 'Save this post',
                onClick: () => console.log('Save'),
                hoverColor: 'components.postEditor.save.hover.color'
              },
              isPublic
                ? {
                    icon: <TbBookDownload />,
                    ariaLabel: 'Unublish this post',
                    tooltip: 'Unpublish this post',
                    onClick: visibilityAlertDisclosure.onOpen,
                    hoverColor: 'components.postEditor.publish.hover.color'
                  }
                : {
                    icon: <TbBookUpload />,
                    ariaLabel: 'Publish this post',
                    tooltip: 'Publish this post',
                    onClick: visibilityAlertDisclosure.onOpen,
                    hoverColor: 'components.postEditor.publish.hover.color'
                  }
            ]}
          />
        </Box>
        <Box />
      </Stack>
      <Alert
        disclosure={visibilityAlertDisclosure}
        confirmationAction={togglePostVisibility}
        confirmationLabel={alertContent.confirmationLabel}
        body={alertContent.body}
        header={alertContent.header}
      />
    </>
  );
};

export default PostEditor;
