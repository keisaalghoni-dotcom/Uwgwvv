import React from 'react';
import { Composition } from 'remotion';
import { FaktaShorts } from './FaktaShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FaktaShorts"
      component={FaktaShorts}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
