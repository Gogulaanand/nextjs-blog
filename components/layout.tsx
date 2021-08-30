import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import Link from "next/link";
import {useEffect} from "react";
import Prism from "prismjs";
import ThemeSwitch from "./themeSwitch";

const name = "Gogulaanand";
export const siteTitle = "Blog";

export default function Layout({ children, home }: {children: React.ReactNode, home?:boolean}) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Personal blog page of Gogulaanand"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://unpkg.com/prismjs@0.0.1/themes/prism-tomorrow.css"
          as="script"
        />
      </Head>
      <header>
        {home? (<>
        <div className="flex flex-row">
          <Image
            priority
            src="/images/profile.jpg"
            className="rounded-full"
            height={56}
            width={56}
            alt={name}
          />
          {/* <ThemeSwitch/> */}
          </div>
          <p className="text-xl">Personal blog by <a href="https://mobile.twitter.com/Gogulaanand13" target="_blank" rel="noreferrer">{name}</a>
          <br/>This is a place where i pen my thoughts and learnings. Happy Reading !</p>
       </> 
       ) : (<Link href="/"><a className="flex justify-start">← back</a></Link>)
        }
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
      
    </div>
  );
}
