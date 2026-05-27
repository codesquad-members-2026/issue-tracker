import { useState } from 'react';
import type { FC, SubmitEvent } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

interface LoginFormProps {
  onSubmit: (id: string, pw: string) => void;
  isLoading?: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(id, pw);
    }
  };

  const isFormValid = id.length > 0 && pw.length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <TextInput
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <TextInput
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <Button 
        type="submit" 
        variant="solid" 
        disabled={!isFormValid}
        className="mt-2"
      >
        {isLoading ? '로그인 중...' : '아이디로 로그인'}
      </Button>
    </form>
  );
};

export default LoginForm;
