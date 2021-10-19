import { useEffect, useState } from "react";
import styled from "styled-components";


function App() {
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      name: "name1",
    },
    {
      id: 2,
      name: "name2",
    },
    {
      id: 3,
      name: "name3",
    },
  ]);
  const [blocksOnBoard, setBlocksOnBoard] = useState({
    0: {
      position: {
        x: 100,
        y: 100
      },
      info: {
        id: 1,
        name: "name1"
      }
    }
  });
  const [currentBoxIndex, setCurrentBoxIndex] = useState(-1);
  const [isDraggable, setIsDraggable] = useState(false);

  useEffect(() => {
    window.onmouseup = (e) => {
      if (isDraggable) {
        const x = e.clientX;
        
        const windowWidth = window.innerWidth;

        if (x > windowWidth - 200) {
          setBlocksOnBoard((prevState) => {
            const newState = {...prevState};
            delete newState[currentBoxIndex];
            return newState;
          })
        }
      }
      setIsDraggable(false);
      setCurrentBoxIndex(-1);
    }
    window.onmousemove = (e) => {
      if (isDraggable) {
        const x = e.clientX;
        const y = e.clientY;

        setBlocksOnBoard(prevState => {
          return {
            ...prevState,
            [currentBoxIndex]: {
              position: {
                x,
                y,
              },
              info: prevState[currentBoxIndex].info
            }
          }
        })
      }
    }
  }, [isDraggable]);

  // console.log(blocksOnBoard)

  return (
    <Container className="App">
      <div className="left">
        {Object.keys(blocksOnBoard).map(blockIndex => {
          const block = blocksOnBoard[blockIndex];
          return (
            <ActiveBox 
              onMouseDown={() => {
                setCurrentBoxIndex(blockIndex);
                setIsDraggable(true);
              }}
              position={block.position} 
              key={"" + blockIndex + "active"}
            >
              {block.info.name}
            </ActiveBox>
          )
        })}
      </div>
      <div className="right">
        {blocks.map(block => (
          <div 
            className="box" 
            key={block.id} 
            onMouseDown={(e) => {
              const x = e.clientX;
              const y = e.clientY;
              setIsDraggable(true);
              setBlocksOnBoard(prevState => {
                const lastIndex = Number(Object.keys(blocksOnBoard).pop()) + 1;
                setCurrentBoxIndex(lastIndex);
                return {
                  ...prevState,
                  [lastIndex]: {
                    position: {
                      x,
                      y
                    },
                    info: block
                  }
                }
              })
            }}
          >
            {block.name}
          </div>
        ))}
      </div>
    </Container>
  );
}

const ActiveBox = styled.div`
  position: fixed;
  left: ${p => `${p.position.x - 15}px`};
  top: ${p => `${p.position.y - 15}px`};
  z-index: 10;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;

  .left {
    flex: 1;
  }

  .right {
    width: 200px;
    border-left: 1px solid #ccc;
    max-height: 100vh;
    overflow-y: scroll;
  }

  .box {
    margin-bottom: 10px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
`;

export default App;
