import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef,useState } from "react";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import fs from 'fs';
import path from 'path';

export interface ImageProps {
  id: number;
  src: string;   // URL of the image
  alt: string;   // Alt text for the image
  format?: string; // Optional: format of the image
  width?: number; // Optional: width for use in styling or attributes
  height?: number; // Optional: height for use in styling or attributes
}


const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const bottomRef = useRef<HTMLDivElement>(null);  // Define the ref here

  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null); // Ref for the announcement box

  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Function to toggle the special announcement visibility
  const toggleAnnouncement = () => {
    setShowAnnouncement(!showAnnouncement);
  };
  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
    if (showAnnouncement) {
      // Scroll to the announcement when it's shown
      announcementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto,showAnnouncement]);



  const scrollToBottom = () => {
    if (!bottomRef.current) {
      console.log("Bottom ref is not set");
      return; // Exit if ref is not set
    }
  
    const bottomPosition = bottomRef.current.offsetTop + bottomRef.current.clientHeight;
    const startPosition = window.pageYOffset;
    const distance = bottomPosition - startPosition;
    const duration = 96000; // Example duration in milliseconds
  
    let startTime = null;
  
    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const nextScroll = linearTween(timeElapsed, startPosition, distance, duration);
  
      window.scrollTo(0, nextScroll);
  
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };
  
  function linearTween(t, b, c, d) {
    return c * t / d + b;
}
  
  

  return (
    <>
      <Head>
        <title>big news !!</title>
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:image" content="/images/og-image.png" />
      </Head>
      <main className="flex flex-col items-center justify-center mx-auto max-w-[1960px] p-4">
        <button onClick={scrollToBottom} className=" rounded-lg mb-4 p-2 text-sm text-white bg-blue-500 hover:bg-blue-700">
          Click here !! I will guide you to the big news !!!
        </button>
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
       

          {images.map(({ id, src, alt }) => (
            <Link key={id} href={`/?photoId=${id}`} as={`/p/${id}`} shallow>
              <div className="block w-full cursor-zoom-in" ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}>
                <Image
                  alt={alt}
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  src={src}
                  layout="responsive"
                  width={720}
                  height={480}
                />
              </div>
            </Link>
          ))}
        </div>

        <footer  ref={bottomRef} className="p-6 text-center text-white/80 sm:p-12">
        <div>
          <button onClick={toggleAnnouncement} className="text-lg font-bold bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300">
            Are you ready ??
          </button>
          {showAnnouncement && (
            <div ref={announcementRef} className="mt-5 p-5 bg-white  text-black rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">Big News!</h2>
              <p>After going through all these memories you have with mom and dad, I chose you as Best Antie and Best Uncle ! <br/>
                I will be coming sooner then you think, I hope you wont disappoint me and my choice, I expect lots of 97ab and Chrab <br/>
                Sincerely, Baby Bedoui
              </p>
            </div>
          )}
        </div>
      </footer>
      </main>
    </>
  );
};

export default Home;



export async function getStaticProps() {
  const imagesDirectory = path.join(process.cwd(), 'public', 'images');
  const imageFiles = fs.readdirSync(imagesDirectory);

  const images = imageFiles.map((filename, index) => {
    const [name, format] = filename.split('.');
    return {
      id: index,
      src: `/images/${filename}`,
      alt: `Description for ${name}`, // Provide meaningful alt text
      format,
    };
  });

  return {
    props: {
      images,
    },
  };
}