import { useMutation } from '@tanstack/react-query';

import { useFeedbackService } from '@/src/infra/feedbackService/FeedbackProvider';
import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useAuth } from '../AuthContext';
import { AuthUser } from '../AuthUser';

export function useAuthSignIn() {
  const { auth } = useRepository();
  const feedbackService = useFeedbackService();
  const { saveAuthUser } = useAuth();

  const { mutate, error, isPending } = useMutation<
    AuthUser,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => auth.signIn(email, password),
    onSuccess: authUser => {
      saveAuthUser(authUser);
      feedbackService.send({
        type: 'success',
        message: `signed in: ${authUser.email}`,
      });
    },
    onError: error => {
      feedbackService.send({
        type: 'error',
        message: `sign in failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    },
  });

  return {
    mutate,
    error,
    isPending,
  };
}
