
import { Container } from "../../../../components/ui/Container";
import { LatestCommentList } from "../LatestCommentList";

export default function Comments(props) {
  return (
    <>
      <div className="mt-12">
        <Container>
          <LatestCommentList projectId={props.params.projectId} />
        </Container>
      </div>
    </>
  )
}