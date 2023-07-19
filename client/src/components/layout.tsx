import React, { ReactNode, useEffect } from 'react';
import { Link } from 'gatsby';
import { css, keyframes } from '@emotion/react';
import nebulousPic from '../../images/nebulous.png';

import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

const makeCssTheme = (jsTheme: object, namespace: string) =>
  Object.entries(jsTheme).reduce(
    (cssTheme, [key, value]) => ({
      ...cssTheme,
      [`--${namespace}-${key}`]: value as string,
    }),
    {},
  );

const defaultTheme = {
  cobalt2blue: '#00389c',
  black: '#222222',
  red: '#ff2600',
  blue: '#1478DB',
  white: '#f5f5f5',
  lightBlack: '#808080',
  lightBlue: '#0047ab',
  variableBlue: '#0d3a58',
  dustyBlue: '#34424C',
  highlightBlue: '#1F4662',
  selectionBlue: '#0050a4',
};

const mainCss = css`
  padding: 1rem 4rem;
  @media (max-width: 480px) {
    padding: 0 0.5rem;
    h1 {
      font-size: 1.25rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const footerCss = css`
  font-size: 2rem;
  clear: both;
  text-align: center;
  border-top: 2px solid var(--default-variableBlue);

  @media (max-width: 480px) {
    margin: 0 auto;
    p {
      font-size: 1rem;
      padding: 0.5rem 0 0 0;
      margin-block-start: 0;
      margin-block-end: 0;
    }
  }
`;

const appHeader = css`
  background: #020204 url(${nebulousPic}) 0 0 no-repeat;
  color: white;
  border-bottom: 7px solid var(--default-variableBlue);
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 200px;
  @media (max-width: 320px) {
    max-width: 320px;
    width: 100%;
  }
`;

const appHeaderHandle = css`
  margin-top: 0.25rem;
  text-align: center;
  font-size: 3rem;
  @media (max-width: 320px) {
    font-size: 2rem;
  }
`;

const appHeaderNav = css`
  width: 100%;
  li {
    display: inline-block;
  }

  a {
    color: var(--default-white);
    &:hover {
      text-decoration: none;
    }
  }
`;

const appHeaderMenuNav = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  padding: 0;
`;

// const appHeaderLoginNav = css`
//   width: 200px;
//   display: flex;
//   float: right;
//   flex-flow: row wrap;
//   justify-content: space-evenly;
// `;

// const appHeaderNavReorder = css`
//   order: -1;
// `;

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const fadeInAnimation = css({
  animation: `${fadeIn} 1s ease-in`,
});

interface ILayout {
  children: ReactNode;
  // authenticated?: boolean;
}

const Layout = (props: ILayout) => {
  const copyrightYear = new Date().getFullYear();

  useEffect(() => {
    const initHighlightedCode = async () => {
      await deckDeckGoHighlightElement();
    };
    void initHighlightedCode();
  }, []);

  const cssTheme = React.useMemo(() => makeCssTheme(defaultTheme, 'default'), [defaultTheme]);

  return (
    <>
      <header style={cssTheme} css={appHeader}>
        <div css={appHeaderHandle}>@mkelley33</div>
        <nav css={appHeaderNav}>
          <ul css={appHeaderMenuNav}>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            {/* <li>
              <Link to="/contact">Contact</Link>
            </li> */}
            {/* <li>
              <Link to="/photos">Photos</Link>
            </li> */}
          </ul>
        </nav>
        {/* <nav css={[appHeaderNav, appHeaderNavReorder]}>
          <ul css={appHeaderLoginNav}>
            <li>{!props.authenticated && <Link to="/register">Register</Link>}</li>
            <li>{props.authenticated ? <Link to="/sign-out">Sign Out</Link> : <Link to="/sign-in">Sign In</Link>}</li>
            {props.authenticated && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
          </ul>
        </nav> */}
      </header>
      <main style={cssTheme} css={[mainCss, fadeInAnimation]}>
        {props.children}
      </main>
      <footer style={cssTheme} css={footerCss}>
        <p>Copyright &copy; {copyrightYear} Michaux Kelley. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
