
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {WishmakerIdentity} from "../src/WishmakerIdentity.sol";

contract WishmakerIdentityTest is Test {
    WishmakerIdentity identity;

    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        identity = new WishmakerIdentity();
    }

    // Test 1: Alice can create an identity.
    function testCreateIdentity() public {
        vm.prank(alice);
        identity.createIdentity();

        assertTrue(identity.hasIdentity(alice));
        assertEq(identity.ownerOf(1), alice);
    }

    // Test 2: Alice cannot create two identities.
    function testCannotCreateTwoIdentities() public {
        vm.startPrank(alice);

        identity.createIdentity();

        vm.expectRevert("Identity already exists");
        identity.createIdentity();

        vm.stopPrank();
    }

    // Test 3: Identity tokens cannot be transferred.
    function testCannotTransferIdentity() public {
        vm.prank(alice);
        identity.createIdentity();

        vm.prank(alice);
        vm.expectRevert("Wishmaker IDs are nontransferable");
        identity.transferFrom(alice, bob, 1);
    }

    // Test 4: Quotients can contain negative values.
    function testNegativeQuotients() public {
        vm.prank(alice);
        identity.createIdentity();

        int16[10] memory scores = [
            int16(-10), int16(20),
            int16(-5), int16(15),
            int16(0), int16(-30),
            int16(40), int16(5),
            int16(-15), int16(25)
        ];

        vm.prank(alice);
        identity.updateQuotients(scores);

        (int16[10] memory stored, ) =
            identity.getProfile(alice);

        assertEq(stored[0], -10);
        assertEq(stored[1], 20);
        assertEq(stored[5], -30);
        assertEq(stored[8], -15);
    }

    // Test 5: A wallet without an identity cannot update scores.
    function testCannotUpdateWithoutIdentity() public {
        int16[10] memory scores;

        vm.prank(bob);
        vm.expectRevert("No identity found");
        identity.updateQuotients(scores);
    }

    // Test 6: Alice cannot burn her identity token.
    function testCannotBurnIdentity() public {
        vm.prank(alice);
        identity.createIdentity();

        // Sending a token to the zero address is not allowed.
        vm.prank(alice);
        vm.expectRevert();
        identity.transferFrom(alice, address(0), 1);

        assertEq(identity.ownerOf(1), alice);
    }

      // Test 7: Bob cannot update Alice's profile.
      function testCannotUpdateAnotherUsersProfile() public {
      // Both users create their own identities.
      vm.prank(alice);
      identity.createIdentity();

      vm.prank(bob);
      identity.createIdentity();

      // Alice sets her Mercury Quotient to 25.
      int16[10] memory aliceScores;
      aliceScores[5] = 25;

      vm.prank(alice);
      identity.updateQuotients(aliceScores);

      // Bob sets his Mercury Quotient to -30.
      int16[10] memory bobScores;
      bobScores[5] = -30;

      vm.prank(bob);
      identity.updateQuotients(bobScores);

      // Verify that each user's profile remains independent.
      (int16[10] memory storedAlice, ) =
          identity.getProfile(alice);

        (int16[10] memory storedBob, ) =
          identity.getProfile(bob);

        assertEq(storedAlice[5], 25);
      assertEq(storedBob[5], -30);

      assertEq(identity.ownerOf(1), alice);
      assertEq(identity.ownerOf(2), bob);
    }


}
