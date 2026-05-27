import { useState } from 'react';
import type { FC, SubmitEvent } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

interface SignupFormProps {
    onSubmit: (userId: string, pw: string, name: string, email: string) => void;
    isLoading?: boolean;
}

const SignupForm: FC<SignupFormProps> = ({ onSubmit, isLoading = false }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(userId, password, name, email);
        }
    };

    // 아이디 6~16자, 비밀번호 6~12자 기본 검증
    const isUserIdValid = userId.length >= 6 && userId.length <= 16;
    const isPasswordValid = password.length >= 6 && password.length <= 12;
    const isFormValid = isUserIdValid && isPasswordValid && !isLoading;

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <TextInput
                    placeholder="아이디 (필수, 6~16자)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                {userId.length > 0 && !isUserIdValid && (
                    <span className="text-xs text-red-500 ml-1">아이디는 6자 이상 16자 이하여야 합니다.</span>
                )}
            </div>
            
            <div className="flex flex-col gap-1">
                <TextInput
                    type="password"
                    placeholder="비밀번호 (필수, 6~12자)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && !isPasswordValid && (
                    <span className="text-xs text-red-500 ml-1">비밀번호는 6자 이상 12자 이하여야 합니다.</span>
                )}
            </div>

            <TextInput
                placeholder="이름 (선택)"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <TextInput
                type="email"
                placeholder="이메일 (선택)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Button
                type="submit"
                variant="solid"
                disabled={!isFormValid}
                className="mt-4"
            >
                {isLoading ? '가입 중...' : '회원가입 완료'}
            </Button>
        </form>
    );
};

export default SignupForm;
