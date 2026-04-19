interface BagIconProps {
  size?: number | string;
style?: React.CSSProperties;
}

export function BagIcon({ size=18, style, ...others }: BagIconProps) {
  return (
    <img
     src="/chips-bag.png"
     alt="My Bag"
     style={{
       width: size,
       height: size,
       objectFit: "contain",
       display: "block",
       ...style,
     }}
    />
  );
}