const AddApplication = () => {
    return (  
        <>
        <form onSubmit = { this.handleSubmit }>
          <label> Job Title:
            <input type="text" name="name" onChange= {this.handleChange}/>
          </label>
          <label> Url:
            <input type="text" name="url" onChange={this.handleChange}/>
          </label>
          <label> Status:
            <input type="dropdown" name="status" onChange={this.handleChange}/>
          </label>
          <button type="submit">Add</button>
        </form>
        </>
    );
}
 
export default AddApplication;