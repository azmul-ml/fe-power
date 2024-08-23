interface IProps {
  className: string;
  backgroundImage: string;
}

export default function BackgroundImage({
  className,
  backgroundImage,
}: IProps) {
  return (
    <div
      className={className}
      style={{
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
}
