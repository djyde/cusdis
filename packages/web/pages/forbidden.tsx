function ForbiddenPage() {
  return (
    <>
      Forbidden
    </>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      
    }
  }
}

export default ForbiddenPage