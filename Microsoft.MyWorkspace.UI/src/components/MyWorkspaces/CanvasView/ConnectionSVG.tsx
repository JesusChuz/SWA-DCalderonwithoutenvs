import * as React from 'react';

interface VirtualMachineSVGProps {
  id: string;
}

export const ConnectionSVG = (props: VirtualMachineSVGProps) => {
  return <path id={props.id} strokeWidth={2} fill='none' />;
};
