import { SignedOut } from "@clerk/nextjs";
import { PersonIcon, StarIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { DiscordLoginButton } from "./_components/discordLoginButton";
import { EmailSignUpButton } from "./_components/emailSignUpButton";

export default async function Home() {
  return (
    <main className="flex-1">
      <section className="h-full w-full bg-gradient-to-b from-[#F9FAFB] to-white pt-12 md:pt-24 lg:pt-32 dark:from-gray-950 dark:to-gray-900">
        <div className="space-y-10 px-4 md:px-6 xl:space-y-16">
          <div className="mx-auto grid max-w-[1300px] gap-4 px-4 sm:px-6 md:grid-cols-2 md:gap-16 md:px-10">
            <div>
              <h1 className="lg:leading-tighter bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                BuyBridge: Seamlessly Connect, Effortlessly Shop
              </h1>
              <p className="mx-auto mb-6 mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Never miss a great deal again with our innovative platform.
                Whether you&apos;re looking for electronics, fashion, home
                goods, or more, BuyBridge brings the best offers from trusted
                retailers to one place. Shop hassle-free and with confidence.
              </p>
              <div className="mt-6 space-x-4">
                <EmailSignUpButton />
                <SignedOut>
                  <DiscordLoginButton />
                </SignedOut>
              </div>
              <div className="mt-8 flex items-center justify-center sm:justify-start">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    4.8 out of 5 stars
                  </span>
                </div>
                <div className="ml-6 flex items-center space-x-2">
                  <PersonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    10,000+ users
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                className="rounded-lg shadow-lg dark:shadow-none"
                src="/ordershipped.svg"
                alt="Hero Image"
                layout="responsive"
                width={600}
                height={600}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gradient-to-b from-white to-[#F9FAFB] py-12 md:py-24 lg:py-32 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-white text-center shadow-md dark:bg-gray-950 dark:shadow-none">
              <div className="p-6">
                <Image
                  className="rounded-lg shadow-lg dark:shadow-none"
                  src="/analytics.svg"
                  alt="Analytics"
                  layout="responsive"
                  width={200}
                  height={200}
                  style={{
                    aspectRatio: "200/200",
                  }}
                />
                <h3 className="mt-4 text-xl font-bold dark:text-white">
                  Advanced Analytics
                </h3>
                <p className="mb-4 mt-2 text-gray-500 dark:text-gray-400">
                  Gain deep insights into your business with our powerful
                  analytics tools.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white text-center shadow-md dark:bg-gray-950 dark:shadow-none ">
              <div className="p-6">
                <Image
                  className="rounded-lg shadow-lg dark:shadow-none"
                  src="/automation.svg"
                  alt="Automation"
                  layout="responsive"
                  width={200}
                  height={200}
                  style={{
                    aspectRatio: "200/200",
                  }}
                />
                <h3 className="mt-4 text-xl font-bold dark:text-white">
                  Workflow Automation
                </h3>
                <p className="mb-4 mt-2 text-gray-500 dark:text-gray-400">
                  Streamline your business processes with our intuitive
                  automation features.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white text-center shadow-md dark:bg-gray-950 dark:shadow-none">
              <div className="p-6">
                <Image
                  className="rounded-lg shadow-lg dark:shadow-none"
                  src="/roi.svg"
                  alt="Return on Investment"
                  layout="responsive"
                  width={200}
                  height={200}
                  style={{
                    aspectRatio: "200/200",
                  }}
                />
                <h3 className="mt-4 text-xl font-bold dark:text-white">
                  Average User increases ROI by 50%
                </h3>
                <p className="mb-4 mt-2 text-gray-500 dark:text-gray-400">
                  Grow your business with our highly scalable and reliable
                  infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
