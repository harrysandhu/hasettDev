import SResponse from './SResponse'


export default interface InviteSResponse extends SResponse{
    invite_id:string,
    invitee_id:string
}