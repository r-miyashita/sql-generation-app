// ここに feature の component をインポートしていく
import InputArea from './feature/input/InputArea';
import EditTableArea from './feature/edit-table/EditTableArea';

function App() {
    return (
        <>
            <p>header</p>

            <p>input-area</p>
            <InputArea />
            <EditTableArea />
            <p>output-area</p>

            <p>footer</p>
        </>
    );
}

export default App;
