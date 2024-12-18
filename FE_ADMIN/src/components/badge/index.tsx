import './styles.css';

const Badge = (props: any) => {
  return (
    <>
      <span className={`badge badge-${props.type}`}>{props.content}</span>
    </>
  );
};

export default Badge;
