using UnityEngine;

namespace UNISA.Actors
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        public float moveSpeed = 6f;
        public float gravity = -9.81f;
        public float jumpHeight = 1.5f;

        private CharacterController controller;
        private Vector3 velocity;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");
            Vector3 move = new Vector3(h, 0, v);
            controller.Move(move * moveSpeed * Time.deltaTime);

            if (controller.isGrounded && velocity.y < 0)
                velocity.y = -2f;

            if (Input.GetButtonDown("Jump") && controller.isGrounded)
                velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);

            velocity.y += gravity * Time.deltaTime;
            controller.Move(velocity * Time.deltaTime);
        }
    }
}