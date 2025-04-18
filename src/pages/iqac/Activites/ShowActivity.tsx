import { useParams } from "react-router"

const ShowActivity = () => {
  const {id} = useParams();
  console.log(id)
  return (
    <div>ShowActivity</div>
  )
}

export default ShowActivity