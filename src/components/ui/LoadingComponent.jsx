import { Container, Spinner } from 'react-bootstrap'

export default function LoadingComponent() {
  return (
    <Container className='d-flex justify-content-center align-items-center vh-100'>
      <Spinner size={300}  />
    </Container>
  )
}