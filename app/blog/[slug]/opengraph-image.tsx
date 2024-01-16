import { allPosts } from '@/.contentlayer/generated';
import { ImageResponse } from 'next/og';

export const alt = 'leey00nsu 블로그';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function Image({ params }: { params: { slug: string } }) {
  const currentPost = allPosts.find((post) => post.slug === params.slug);

  const response = await fetch(
    new URL('@/app/fonts/Pretendard-SemiBold.woff', import.meta.url),
  );
  const pretendardSemiBold = await response.arrayBuffer();

  return new ImageResponse(
    (
      <div
        tw="flex flex-col h-full w-full items-center justify-center bg-[#4a83be] text-white"
        style={{
          fontFamily: 'PretendardSemiBold',
        }}
      >
        <p tw="flex text-8xl ">leey00nsu 블로그</p>
        <p tw="flex text-3xl ">{currentPost?.title}</p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'PretendardSemiBold',
          data: pretendardSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}
