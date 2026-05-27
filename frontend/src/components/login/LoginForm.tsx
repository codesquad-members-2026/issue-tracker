import { useState } from 'react';
import type { FC, SubmitEvent } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

interface LoginFormProps {
  onSubmit: (id: string, pw: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id && pw) {
      onSubmit(id, pw);
    }
  };

  const isFormValid = id.length > 0 && pw.length > 0;

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
        아이디로 로그인
      </Button>
    </form>
  );
};

export default LoginForm;
