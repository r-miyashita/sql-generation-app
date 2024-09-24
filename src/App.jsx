// ここに feature の component をインポートしていく
import InputArea from './feature/input/InputArea';

function App() {
    return (
        <>
            <p>header</p>

            <p>input-area</p>
            <InputArea />
            <p>editable-area</p>
            <p>output-area</p>

            <p>footer</p>
        </>
    );
}

export default App;
