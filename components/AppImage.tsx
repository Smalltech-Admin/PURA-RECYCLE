import NextImage, { type ImageProps } from 'next/image';
import { withBasePath } from '@/lib/basePath';

export function AppImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? withBasePath(props.src) : props.src;
  return <NextImage {...props} src={src} />;
}
