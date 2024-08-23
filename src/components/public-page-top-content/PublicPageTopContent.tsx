interface IProps {
  title: string;
  description: string;
}
export default function PublicPageTopContent({ title, description }: IProps) {
  return (
    <>
      <h4 className="font-size-18 mt-5 text-center">{title}</h4>
      <p className="text-muted text-center">{description}</p>
    </>
  );
}
