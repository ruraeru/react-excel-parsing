import { useState } from "react";
import styled from "styled-components";

const Modal = (props) => {
    const { setModal, setInput } = props;
    const [text, setText] = useState("");
    const closeModal = () => {
        setModal(false);
    }
    const onChange = (e) => {
        e.preventDefault();
        setInput({
            value: e.target.value
        });
    }

    const onText = (e) => {
        const a = (e.target.value).split(",");
        console.log(a);
        setText(a);
        setInput(a);
    }
    return (
        <Div>
            <button onClick={closeModal}>닫기</button>
            <div>
                <p>
                    {text}
                </p>
                <input onChange={onText} />
            </div>
        </Div>
    )
};

const Div = styled.div`
   width: 400px;
   height: 200px;
   z-index: 999;

   input {

   }
   display: flex;
   flex-direction: column;
   background-color: red;
`

export default Modal;