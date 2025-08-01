from fastapi import HTTPException, status

class CustomHTTPException:
    @staticmethod
    def missing_jid():
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "Error", "message": "Missing 'jid' in request."}
        )

    @staticmethod
    def message_from_bot():
        return HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail={"status": "Ignored", "message": "Messages from hoster/bot will be ignored."}
        )

    @staticmethod
    def missing_typebot_public_id():
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "Error", "message": "Missing 'typebot_public_id' in request."}
        )

    @staticmethod
    def missing_typebot_placeholder():
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "Error", "message": "Missing 'placeholder' in typebot input request."}
        )

    @staticmethod
    def whatsapp_sender_error(whatsapp_response):
        return HTTPException(
            status_code=whatsapp_response["code"],
            detail={"status": "Error", "message": whatsapp_response["error"]}
        )
