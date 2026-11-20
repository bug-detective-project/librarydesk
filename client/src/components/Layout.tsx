import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Icon } from './Icon.tsx';
import styles from './Layout.module.css';

export function Layout() {
  // On a narrow window the screens hide behind a menu button; a wide one always shows them.
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, search } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Going to another screen closes the menu.
  const [address, setAddress] = useState(pathname + search);
  if (address !== pathname + search) {
    setAddress(pathname + search);
    setMenuOpen(false);
  }

  // While the menu is open, a click outside the header and the Escape key close it.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className={styles.page}>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.brand}>
          <span aria-hidden="true" className={styles.mark}>
            <Icon name="book" size={20} />
          </span>
          <div>
            <h1 className={styles.name}>LibraryDesk</h1>
            <p className={styles.school}>Escola Estadual Ipê Amarelo</p>
          </div>
        </div>
        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <nav id="main-nav" aria-label="Main" className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink to="/" end>
            <Icon name="book" />
            Collection
          </NavLink>
          <NavLink to="/readers">
            <Icon name="users" />
            Readers
          </NavLink>
          <NavLink to="/loans">
            <Icon name="lend" />
            Loans
          </NavLink>
        </nav>
        <p className={styles.desk}>
          <span aria-hidden="true" className={styles.avatar}>
            LD
          </span>
          Library desk
        </p>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
