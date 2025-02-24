"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../layout';

const projects = [
  { id: 1, name: 'Project A' },
  { id: 2, name: 'Project B' },
  { id: 3, name: 'Project C' },
];

const ProjectListPage = () => {
  const router = useRouter();

  useEffect(() => {
    
  }, []);


  return (
    <Layout>
      <div>
        <h1>Project List</h1>
        <ul>
          {projects.map(project => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ProjectListPage;
