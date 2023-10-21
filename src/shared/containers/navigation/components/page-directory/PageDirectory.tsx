import { Accordion, Box, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { FC, Fragment, useMemo, useState } from 'react';
import { NavMenuSection, NavMenuItem } from '../../../../types/navigation';
import { createPageTree, getExpandedMenuItemIndices } from '../../../../utils/navigation';
import { useAuthenticationContext } from '@atsnek/jaen';
import TbBook from '../../../../components/icons/tabler/TbBook';
import TbUsers from '../../../../components/icons/tabler/TbUsers';
import { generateMenuItem } from './utils/pageDirectory';

interface PageDirectoryProps {
  data: ReturnType<typeof createPageTree>;
  isExpanded?: boolean;
  isMobile?: boolean;
  closeMobileDrawer?: () => void;
}
/**
 * The page directory component that shows the documentation structure.
 */
const PageDirectory: FC<PageDirectoryProps> = ({
  data,
  isExpanded = true,
  isMobile = false,
  closeMobileDrawer
}) => {
  // Calculate the default expanded indices for the accordion
  const defaultExpandedIdx = useMemo(() => {
    return data.menu ? getExpandedMenuItemIndices(data.menu) : [];
  }, [data.activeIdx]);

  // Keep track of the items that have been expanded by the user
  const [expandedIdx, setExpandedIdx] = useState<number[]>(defaultExpandedIdx);
  const { isAuthenticated, openLoginModal } = useAuthenticationContext();
  const isSmallScreen =
    typeof window === 'undefined' ? false : useBreakpointValue({ base: true, md: false });

  const updateExpandedIdx = (idx: number, mode: 'toggle' | 'set') => {
    const isIncluded = expandedIdx.includes(idx);
    if (mode === 'toggle' && isIncluded) {
      setExpandedIdx(expandedIdx.filter(i => i !== idx));
      return;
    }
    if (!isIncluded) setExpandedIdx([...expandedIdx, idx]);
  };

  const baseMenuItems: NavMenuSection[] = [
    {
      name: 'Community',
      icon: <TbUsers />,
      items: [
        {
          name: 'Posts',
          href: '/community'
        }
      ]
    },
    {
      name: 'More',
      icon: <TbBook />,
      items: [
        {
          name: 'PhotonQ',
          href: '/'
        }
      ]
    }
  ];

  if (isSmallScreen && !isAuthenticated) {
    baseMenuItems.unshift({
      name: '',
      items: [
        {
          name: 'Sign In',
          onClick: openLoginModal
        }
      ]
    });
  }

  let menuRootExpandedIdx = 0;

  return (
    <Accordion
      id="left-nav-accordion"
      visibility={isExpanded ? 'visible' : 'hidden'}
      opacity={isExpanded ? 1 : 0}
      w={isExpanded ? '100%' : 'max-content'}
      allowMultiple
      css={{
        // Remove border from last accordion item
        '& .chakra-accordion__item:last-child': {
          borderBottomWidth: 0
        }
      }}
      variant="leftNav"
      transition="opacity 0.2s ease-in-out, width 0.2s ease-in-out"
      mb={isMobile ? 12 : undefined}
      index={expandedIdx}
    >
      {[...data.menu, ...baseMenuItems].map((section, i) => (
        <Fragment key={i}>
          {section.name && (
            <HStack
              key={0}
              spacing={2}
              ml={4}
              mt={i === 0 ? 0 : 9}
              fontSize="sm"
              fontWeight="bold"
              {...section.styling}
              color="components.pageDirectory.section.title.color"
              opacity={1}
            >
              <Text>{section.name}</Text>
              {section.icon}
            </HStack>
          )}
          <Box key={1}>
            {section.items?.map((item: NavMenuItem) => {
              const res = generateMenuItem(
                item,
                isMobile,
                updateExpandedIdx,
                menuRootExpandedIdx,
                closeMobileDrawer
              );
              menuRootExpandedIdx = res.idx++;
              return res.item;
            })}
          </Box>
        </Fragment>
      ))}
    </Accordion>
  );
};

export default PageDirectory;
