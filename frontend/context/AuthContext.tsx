'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
    isLoading: boolean;
    updateProfile: (name: string, email: string) => void;
    changePassword: (password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // 초기 테스트 유저 데이터 세팅
        const storedUsersList = localStorage.getItem('users');
        if (!storedUsersList) {
            const initialUsers = [
                {
                    name: 'Admin',
                    email: 'admin@vuln.camp',
                    password: 'admin123$',
                    joinedAt: new Date().toISOString().split('T')[0]
                }
            ];
            localStorage.setItem('users', JSON.stringify(initialUsers));
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                // Store user
                const newUser = { email, name: data.username || email.split('@')[0] };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                router.push('/');
            } else {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    const updateProfile = (name: string, email: string) => {
        if (!user) return;
        const updatedUser = { ...user, name, email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('회원정보가 수정되었습니다.');
    };

    const changePassword = (password: string) => {
        // 비밀번호 변경 API 상태 업데이트
        alert('비밀번호가 변경되었습니다.');
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isLoading, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
