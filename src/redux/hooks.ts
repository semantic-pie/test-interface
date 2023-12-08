import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useEffect } from 'preact/hooks'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useKeyDown = (callback: () => void, keys: string[]) => {
 const onKeyDown = (event) => {
   const wasAnyKeyPressed = keys.some((key) => event.key === key);
   if (wasAnyKeyPressed) {
     event.preventDefault();
     callback();
   }
 };
 useEffect(() => {
   document.addEventListener('keydown', onKeyDown);
   return () => {
     document.removeEventListener('keydown', onKeyDown);
   };
 }, [onKeyDown]);
};