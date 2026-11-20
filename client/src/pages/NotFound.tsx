import { Link } from 'react-router';
import ui from '../components/ui.module.css';

export function NotFound() {
  return (
    <section>
      <h2>This page is not on the shelf</h2>
      <p className={ui.muted}>
        Go back to the <Link to="/">collection</Link>.
      </p>
    </section>
  );
}
