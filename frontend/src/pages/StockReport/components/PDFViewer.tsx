import pdf from '../../../static/dummy.pdf'

const PDFViewer = () => {
    return (
        <div style={{ height: '100%' }}>
            <iframe src={pdf} width='100%' height='100%' />
        </div>
    );
};
export default PDFViewer;