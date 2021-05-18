import React from 'react';

import { Card } from '../../components';
import { ReactComponent as MagicWand } from '../../res/icons/magic-wand.svg';
import { ReactComponent as CuteBrain } from '../../res/icons/cute-brain.svg';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center bg-gray-50 min-w-screen min-h-screen py-14">
      <div className="w-10/12 lg:max-w-4xl">
      <div className="flex flex-col justify-center min-h-screen">
          <div className="text-center mb-16">
            <div className="font-poppins font-bold text-christalle text-4xl">Welcome to BigBrain</div>
            <div className="font-roboto text-roman font-medium text-md">The world&apos;s most innovative quiz platform</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-y-0 py-14 md:py-0">
            <div className="flex justify-center md:justify-end items-center md:mr-5">
              <Card
                Icon={CuteBrain}
                title="Play"
                subtitle="I want to test my knowledge!"
                link="/play"
              />
            </div>
            <div className="flex justify-center md:justify-start items-center md:ml-5" test-marker="landing-to-login-btn">
              <Card
                Icon={MagicWand}
                title="Admin"
                subtitle="I want to create and manage quizzes!"
                link="/login"
              />
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}

export default LandingPage;
