import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  return (
    <div style={{
      width: "100%",
      maxWidth: "900px",
      padding: "0 16px"
    }}>
      <ProjectCard
      postTitle='title' 
      user='del0m_' 
      postTags={['ML developer', 'DevOps']}
      description='the quick brown fox jumped over the lazy dog'
      timeAgo='2 hours ago'/>
      <ProjectCard 
      postTitle='title' 
      user='del0m_' 
      postTags={['ML developer', 'DevOps']}
      description='the quick brown fox jumped over the lazy dog'
      timeAgo='2 hours ago'/>
    </div>
    
  );
}
