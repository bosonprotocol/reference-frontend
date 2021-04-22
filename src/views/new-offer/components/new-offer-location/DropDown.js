export const DropDownContainer = (props) => {
    const {id, refInput, selected, receiver, renderValues} = props;

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
                    {renderValues()}
            </select>
        </div>
    )
}