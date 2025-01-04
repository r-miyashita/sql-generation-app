// ここに feature の component をインポートしていく
import InputArea from './feature/input/InputArea';
import EditTableArea from './feature/edit-table/EditTableArea';
import OutputArea from './feature/output/OutputArea';

function App() {
    return (
        <>
            <p>header</p>

            <p>input-area</p>
            <InputArea />
            <EditTableArea />
            <OutputArea />
            <p>footer</p>
        </>
    );
}

export default App;
