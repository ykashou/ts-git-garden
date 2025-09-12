import ResearchPaper from '../ResearchPaper';

export default function ResearchPaperExample() {
  return (
    <div className="max-w-2xl">
      <ResearchPaper
        title="Advancing Machine Learning Interpretability Through Novel Visualization Techniques"
        authors={["Jane Doe", "John Smith", "Alice Johnson"]}
        abstract="This paper presents a comprehensive study of machine learning interpretability methods, introducing novel visualization techniques that enhance understanding of complex neural networks. Our approach combines traditional saliency mapping with interactive 3D representations, enabling researchers and practitioners to better comprehend model decision-making processes. We demonstrate the effectiveness of our methods across multiple domains including computer vision, natural language processing, and tabular data analysis."
        journal="Nature Machine Intelligence"
        year={2024}
        doi="10.1038/s42256-024-00123-4"
        pdfUrl="https://example.com/paper.pdf"
        tags={["Machine Learning", "Interpretability", "Visualization", "Neural Networks"]}
        status="published"
      />
    </div>
  );
}