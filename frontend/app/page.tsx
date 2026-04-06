'use client'
 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function globalRedirect(){
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token){
      router.push('/feed')
    }
    else{
      router.push('/auth')
    }
  }, [router])
  return null
}

export const API_ENTRYPOINT = "http://localhost:5000"