export const DropDownContainer = (props) => {
    const {id, refInput, selected, receiver, arr} = props;

    const renderOptions = (arr)  => {
        let options = []
    
        for (let i = 0; i < arr?.length; i++) {
          options.push(<option key={i} value={arr[i]}>{arr[i]}</option>)
        }
    
        return options
      }

    return (
        <div className="dropdown-container">
            <select 
                className="select minimal" ref={refInput}
                id={id}
                value={selected}
                onChange={(e) =>
                    receiver(e.target ? e.target.value : null)
                }
                >
                {renderOptions(arr)}
            </select>
        </div>
    )
}