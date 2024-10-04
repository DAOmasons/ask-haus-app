import { STEEL } from '../theme';

export const LinesBg = () => {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0 18 H18"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M18 18 V87"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M18 87 H85"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M85 87 V100"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />

      <path
        d="M0 19 H17"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M17 19 V88"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M17 88 H84"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M84 88 V100"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />

      <path
        d="M0 20 H16"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M16 20 V89"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M16 89 H83"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
      <path
        d="M83 89 V100"
        fill="none"
        stroke={STEEL[9]}
        strokeWidth=".5px"
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
    </svg>
  );
};
