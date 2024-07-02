// styled.js
import styled from 'styled-components';



export const Box = styled.div`
    background-color: #ffffff;  // White background color
    padding: 20px;
    border-radius: 16px;  // Slightly more rounded corners
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px auto;

    display: flex;
    flex-direction: row;
    align-content: space-between;
    column-gap: 20px;
    flex-wrap: wrap;
    row-gap: 20px;
`;

export const Card = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
border: 1px solid #e7e7e7;
flex-wrap: wrap;
padding: 20px;
border-radius: 15px;;
width: 100%;
`;

export const Title = styled.div`
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 5px;
`;

export const Subtitle = styled.div`
    font-size: 0.9em;
    color: #555;
    margin-bottom: 20px;
`;

export const ValueContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

export const Value = styled.div`
    font-size: 2em;
    font-weight: bold;
    margin-right: 10px;
    color: ${props => props.color || '#000'};
`;

export const Unit = styled.div`
    font-size: 0.8em;
    color: #777;
`;

export const Icon = styled.div`
    display: inline-block;
    margin-left: auto;
    font-size: 1.5em;
    color: #333;
`;

export const Button = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    background-color: #3e8e41;
  }
`;