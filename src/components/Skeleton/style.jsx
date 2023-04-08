import styled from "styled-components";

export const StyleSkeleton = styled.span`
    background: #eee;
    background: linear-gradient(110deg, #ececec 20%, #f5f5f5 25%);
    border-radius:5px;
    background-size:200% 100%;
    animation:1.5s shine linear infinite;
    width:100%;
    display:block;
    @keyframes shine {
        to {
            background-position-x: -200%;
        }
    }
`