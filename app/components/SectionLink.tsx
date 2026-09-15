"use client";

import Link from "next/link";

/* A `/#id` link that also works when the URL already ends in `#id`.
 *
 * Next's router only scrolls to a hash when the hash *changes* (navigate-
 * reducer.js: `url.hash !== oldUrl.hash`). So after clicking Businesses once,
 * scrolling down, and clicking it again, Next saw the same URL and did
 * nothing. A plain <a> would re-scroll, but it can't prepend basePath or
 * navigate client-side from /about, so this keeps <Link> and handles only the
 * same-hash case itself. scrollIntoView honours `scroll-padding-top`, so it
 * lands exactly where the first click did. */
export default function SectionLink({
  id,
  className,
  style,
  children,
  ...rest
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <Link
      href={`/#${id}`}
      className={className}
      style={style}
      {...rest}
      onClick={(e) => {
        // Leave new-tab / new-window clicks to the browser.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        const target = document.getElementById(id);
        if (!target || window.location.hash !== `#${id}`) return;
        e.preventDefault();
        target.scrollIntoView();
      }}
    >
      {children}
    </Link>
  );
}
