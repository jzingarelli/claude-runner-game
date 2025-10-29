import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email(), password: z.string().min(8), twoFactorToken: z.string().optional() });

export interface LoginFormProps { onSubmit: (values: z.infer<typeof schema>) => void; loading?: boolean }

export default function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <input placeholder="Email" {...register('email')} />
      {errors.email && <small>{errors.email.message}</small>}
      <input type="password" placeholder="Password" {...register('password')} />
      {errors.password && <small>{errors.password.message}</small>}
      <input placeholder="2FA token (if enabled)" {...register('twoFactorToken')} />
      <button disabled={loading} type="submit">Login</button>
    </form>
  );
}
