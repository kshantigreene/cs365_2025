type Props = {
  message?: string;
};

export default function LoadingState({ message = "Loading..." }: Props) {
  return (
    <div className="state-card state-loading">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}



