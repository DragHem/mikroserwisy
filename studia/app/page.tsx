import { auth, signIn } from '@/auth';
import { sendLoggedInMessage } from './messageBroker/messageBroker';

export default async function Page() {
  const session = await auth();
  console.log('🚀 ~ Page ~ session:', session);

  if (!session?.user)
    return (
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button>Sign In</button>
      </form>
    );
  sendLoggedInMessage(session?.user?.name);

  return (
    <div className="space-y-2">
      <p>{session.user.name}</p>
      <p> {session.user.email}</p>
    </div>
  );
}
