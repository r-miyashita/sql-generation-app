import { Header } from '@/feature/ui/header';
import { InputArea } from '@/feature/input';
import EditTableArea from '@/feature/edit-table/EditTableArea';
import OutputArea from '@/feature/output/OutputArea';

function App() {
    return (
        <>
            <Header />
            <InputArea />
            <EditTableArea />
            <OutputArea />
            <p>footer</p>
        </>
    );
}

export default App;
