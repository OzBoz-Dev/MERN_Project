"use client";

import ProjectTag from "./ProjectTag";

export default function TagHolder({tags}: {tags: string[]}) {
  return (
    <div>
      {tags.map((tag, idx) => (
        <ProjectTag tag={tag} key={idx}/>
      ))}
    </div>
  );
}