import styled from "styled-components";

export const FieldStyle = styled.div`
    &.error {
        .form-control {
            border-color: red;
            color: red;
            ::placeholder {
                color:red
            }
        }
    }
`

export const ErrorStyle = styled.span`
    color:red;
    position: absolute;
    font-size:0.8rem;
    font-style:italic;
    left:0;
    top:100%;
`