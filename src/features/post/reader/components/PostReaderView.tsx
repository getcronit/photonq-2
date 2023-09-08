import { FC, useEffect, useState } from 'react';
import { MainBreadcrumbPart } from '../../../../shared/types/navigation';
import LeftNavPostReader from './LeftNavPostReader';
import {
  Box,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import Heading from '../../../main-content/heading/components/Heading';
import RightNavPostReader from './RightNavPostReader';
import MainBreadcrumb from '../../../../shared/containers/navigation/components/MainBreadcrumb';
import UserPreview from '../../../user/avatar/components/UserPreview';
import { TUser } from '../../../user/types/user';
import Link from '../../../../shared/components/Link';
import TbStar from '../../../../shared/components/icons/tabler/TbStar';
// import { posts } from '../../../../shared/utils/features/post';
import { formatNumber } from '../../../../shared/utils/utils';
import MainGrid from '../../../../shared/containers/components/MainGrid';
import TopNav from '../../../../shared/containers/navigation/TopNav';
import { TPost } from '../../types/post';
import { sq } from '@snek-functions/origin';
import useAuth from '../../../../shared/hooks/use-auth';
import { fetchProfile } from '../../../user/utils/user';

interface IPostReaderViewProps {
  postId: string;
}

/**
 * Component for reading a post.
 */
const PostReaderView: FC<IPostReaderViewProps> = ({ postId }) => {
  const topNavDisclosure = useDisclosure();
  const breadcrumbParts: MainBreadcrumbPart[] = [
    {
      name: '@emilybrooks',
      href: '/profile',
      isUser: true,
      showUserImage: true
    },
    {
      name: 'Posts',
      href: '/profile#posts'
    },
    {
      name: 'Unlocking the Power of Quantum Computing',
      href: '#'
    }
  ];

  const [post, setPost] = useState<TPost>();
  const [author, setAuthor] = useState<TUser>();
  const isAuthenticated = useAuth();

  useEffect(() => {
    fetchPost(postId).then(post => {
      if (!post) return;
      setPost(post);

      if (post.authorProfileId !== null) {
        fetchProfile(post.authorProfileId).then(user => {
          console.log('fetched user: ', user);
          if (!user) return;
          setAuthor(user);
        });
      }
    });
  }, []);

  const fetchPost = async (id: string): Promise<TPost | undefined> => {
    const [post, error] = await sq.query((q): TPost | undefined => {
      const post = q.socialPost({ postId: id });
      if (!post) return;
      const { id: currentUserId } = isAuthenticated
        ? q.userMe
        : { id: undefined };

      return {
        id: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content ?? undefined,
        createdAt: post.createdAt,
        avatarUrl: post.avatarURL,
        stars: post.stars.length,
        privacy: post.privacy ?? 'private',
        canManage: false,
        authorProfileId: post.profileId
      };
    });

    if (error) return;
    console.log('fetched post', post);
    return post;
  };

  return (
    <MainGrid>
      <LeftNavPostReader post={post} user={author} />
      <Stack spacing={{ base: 0, xl: 12 }} direction="row" mb={10}>
        <Box maxW="900px" w="full">
          <MainBreadcrumb parts={breadcrumbParts} />
          <HStack opacity={0.75} spacing={0}>
            <Text fontSize="sm" color="gray.500">
              {/* {post.publicationDate} */}
            </Text>
          </HStack>
          <Heading variant="h1" mt={0} mb={10}>
            Unlocking the Power of Quantum Computing
            {isAuthenticated && (
              <IconButton
                icon={<TbStar />}
                aria-label="Rate post"
                variant="ghost-hover-opacity"
                _hover={{
                  opacity: 1,
                  transform: 'scale(1.3)',
                  color: 'features.rating._hover.color'
                }}
              />
            )}
          </Heading>
          <VStack spacing={3} alignItems="start">
            <Text>
              Quantum computing is a cutting-edge technology that has the
              potential to revolutionize various fields, from cryptography to
              drug discovery and optimization problems. One approach to quantum
              computing is quantum annealing, which is an optimization process
              that leverages quantum fluctuations to find the global minimum of
              an objective function. Unlike classical computing methods such as
              simulated annealing, quantum annealing starts with a
              quantum-mechanical superposition of all possible states and
              evolves according to the time-dependent Schrödinger equation. This
              allows the system to undergo quantum parallelism and quantum
              tunneling between states, enabling it to efficiently explore
              energy landscapes and find the optimal solution. Quantum annealing
              has shown promising results in solving combinatorial optimization
              problems with many local minima and has both experimental and
              theoretical evidence to support its effectiveness.
            </Text>
            <Heading variant="h2" w="full">
              Quantum Annealing
            </Heading>
            <Text>
              In the field of artificial intelligence (AI), another aspect of
              unlocking the power of quantum computing lies in AI alignment.
              Paul Christiano, an American AI safety researcher, focuses on
              steering AI systems towards human interests. He has worked on deep
              reinforcement learning from human preferences and AI safety via
              debate, which are crucial areas in ensuring that AI systems align
              with human values and goals. Christiano's research emphasizes the
              importance of reinforcement learning with human feedback in
              harnessing the potential of AI for positive impact. By
              incorporating human preferences and perspectives into AI systems,
              we can mitigate risks and ensure that AI technology remains
              aligned with human interests.
            </Text>
            <Heading variant="h2" w="full">
              AI Alignment
            </Heading>
            <Text>
              While quantum computing holds immense promise, it is essential to
              acknowledge the theoretical foundations that underpin it. One such
              theory is the de Broglie-Bohm theory, which posits that the
              velocities of particles are determined by the wavefunction in a
              3N-dimensional configuration space. This theory provides insights
              into the behavior of quantum systems and helps us understand how
              particles move and interact within the framework of quantum
              mechanics. By studying theories like de Broglie-Bohm theory,
              researchers gain a deeper understanding of the principles that
              govern quantum phenomena and can further advance our knowledge in
              the field of quantum computing.
            </Text>
            <Heading variant="h2" w="full">
              Conclusion
            </Heading>
            <Text>
              In conclusion, unlocking the power of quantum computing requires
              exploring various aspects such as quantum annealing for
              optimization problems, AI alignment to ensure ethical and
              beneficial AI systems, and theoretical frameworks like de
              Broglie-Bohm theory for foundational understanding. These
              different elements come together to push the boundaries of what is
              possible in computing and pave the way for transformative
              advancements in science, technology, and society as a whole. As we
              continue to delve deeper into the realm of quantum computing, it
              is important to foster collaboration between researchers, industry
              experts, and policymakers to harness its potential while
              addressing any ethical, societal, and security concerns that may
              arise along the way.
            </Text>
          </VStack>
        </Box>
        <RightNavPostReader />
      </Stack>
    </MainGrid>
  );
};

export default PostReaderView;
